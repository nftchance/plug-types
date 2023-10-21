import { TypedDataEncoder } from 'ethers'

import { TypedData, TypedDataParameter } from 'abitype'
import { TypedDataType } from 'abitype/zod'

import pc from 'picocolors'

import { Config } from '@/core/config'
import { defaultConfig } from '@/lib/constants'

export function getPacketHashGetterName(config: Config, typeName: string) {
	if (typeName.includes('[]')) {
		if (config.dangerous.useOverloads) return `getArrayPacketHash`

		return `get${config.dangerous.packetHashName(
			typeName.slice(0, typeName.length - 2)
		)}ArrayPacketHash`
	}

	if (config.dangerous.useOverloads) return `getPacketHash`

	return `get${config.dangerous.packetHashName(typeName)}PacketHash`
}

export function getEncodedValueFor(config: Config, field: TypedDataParameter) {
	// * Hashed types.
	if (field.type === 'bytes') return `keccak256($input.${field.name})`

	// * Basic types.
	const isBasicType = TypedDataType.safeParse(field.type)

	if (isBasicType.success) return `$input.${field.name}`

	// * Array and object types (ie: nested values.)
	return `${getPacketHashGetterName(config, field.type)}($input.${
		field.name
	})`
}

export function getPacketHashGetters<
	TTypes extends TypedData,
	TTypename extends keyof TTypes extends string ? keyof TTypes : never
>(
	config: Config,
	typeName: TTypename,
	fields: TTypes[TTypename],
	packetHashGetters: Array<string> = []
) {
	if (typeName.includes('[]')) {
		packetHashGetters.push(getArrayPacketHashGetter(config, typeName))
	} else {
		packetHashGetters.push(`\t/**
     * @notice Encode ${typeName} data into a packet hash and verify decoded ${typeName} data 
     *         from a packet hash to verify type compliance and value-width alignment.
     * @param $input The ${typeName} data to encode.
     * @return $packetHash The packet hash of the encoded ${typeName} data.
     */
    function ${getPacketHashGetterName(config, typeName)}(
        ${typeName} memory $input
    )
        public
        pure
        returns (bytes32 $packetHash)
    {
        $packetHash = keccak256(abi.encode(
            ${typeName
				.replace(/([a-z])([A-Z])/g, '$1_$2')
				.replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1_$2')
				.replace(/([0-9])([A-Z])/g, '$1_$2')
				.toUpperCase()}_TYPEHASH,
            ${fields
				.map(field => {
					return getEncodedValueFor(config, field)
				})
				.join(',\n\t\t\t')}
        ));
    }\n`)
	}

	fields.forEach(field => {
		if (field.type.includes('[]')) {
			packetHashGetters.push(getArrayPacketHashGetter(config, field.type))
		}
	})

	return packetHashGetters
}

export const getArrayPacketHashGetter = (
	config: Config,
	typeName: string
) => `\t/**
     * @notice Encode ${typeName} data into a packet hash and verify decoded ${typeName} data 
     *         from a packet hash to verify type compliance and value-width alignment.
     * @param $input The ${typeName} data to encode. 
     * @return $packetHash The packet hash of the encoded ${typeName} data.
     */
    function ${getPacketHashGetterName(config, typeName)}(
        ${typeName} memory $input
    ) 
        public 
        pure 
        returns (bytes32 $packetHash) 
    {
        bytes memory encoded;

        uint256 i;
        uint256 length = $input.length;

        for (i; i < length;) {
            encoded = bytes.concat(
                encoded,
                ${getPacketHashGetterName(
					config,
					typeName.substr(0, typeName.length - 2)
				)}($input[i])
            );

            unchecked { i++; }
        }
        
        $packetHash = keccak256(encoded);
    }\n`

export function getSolidity(config: Config) {
	const results: { struct: string; typeHash: string }[] = []
	const packetHashGetters: string[] = []
	const digestGetters: string[] = []
	const signerGetters: string[] = []

	// @ts-expect-error - Smashing abitype types into ethers.
	const encoder = new TypedDataEncoder(config.types)

	Object.keys(config.types).forEach(typeName => {
		// * Determine the name of the type hash constant.
		const typeHashName = `${typeName
			.replace(/([a-z])([A-Z])/g, '$1_$2')
			.replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1_$2')
			.replace(/([0-9])([A-Z])/g, '$1_$2')
			.toUpperCase()}_TYPEHASH`

		// * Generate the basic solidity code for the type hash.
		const typeHash = `\t/**
     * @dev Type hash representing the ${typeName} data type providing EIP-712
     *      compatability for encoding and decoding.
     * 
     * ${typeHashName} extends TypeHash<EIP712<{
     *   ${config.types[typeName as keyof typeof config.types]
			.map(field => {
				return `{ name: '${field.name}', type: '${field.type}' }`
			})
			.join('\n\t *   ')} 
     * }>>
     */
    bytes32 constant ${typeHashName} = keccak256('${encoder.encodeType(
		typeName
	)}');\n`

		packetHashGetters.push(
			...getPacketHashGetters(
				config,
				typeName,
				config.types[typeName],
				packetHashGetters
			)
		)

		results.push({
			struct: `\t/**
     * @notice This struct is used to encode ${typeName} data into a packet hash and
     *         decode ${typeName} data from a packet hash.
     * 
     * ${typeName} extends EIP712<{ 
     *    ${config.types[typeName]
			.map(field => {
				return `{ name: '${field.name}', type: '${field.type}' }`
			})
			.join('\n\t *    ')}
     * }>
     */
    struct ${typeName} {\n${config.types[typeName]
		.map(field => {
			return `\t\t${field.type} ${field.name};\n`
		})
		.join('')}\t}`,
			typeHash
		})

		// * Generate the digest getter for each type.
		digestGetters.push(`\t/**
    * @notice Encode ${typeName} data into a digest hash.
    * @param $input The ${typeName} data to encode.
    * @return $digest The digest hash of the encoded ${typeName} data.
    */
    function getDigest(
        ${typeName} memory $input
    )
        public
        view
        returns (bytes32 $digest)
    {
        $digest = keccak256(
            abi.encodePacked(
                "\\x19\\x01",
                domainHash,
                getPacketHash($input)
            )
        );
    }`)

		// If the type has a field with the name "signature" then we need to generate a
		// signer getter for it.
		if (config.types[typeName].find(field => field.name === 'signature')) {
			const dataFieldName = config.types[typeName].find(
				field => field.name !== 'signature'
			)?.name

			signerGetters.push(`\t/**
    * @notice Recover the signer of a digest hash.
    * @param $input The digest hash to recover the signer from.
    * @return $signer The signer of the digest hash.
    */
    function getSigner(
        ${typeName} memory $input
    )
        public
        view
        returns (address $signer)
    {
        $signer = getDigest($input.${dataFieldName}).recover($input.signature);
    }`)
		}
	})

	const uniquePacketHashGetters = [...new Set(packetHashGetters)]
	const uniqueDigestGetters = [...new Set(digestGetters)]
	const uniqueSignerGetters = [...new Set(signerGetters)]

	console.log(
		pc.green(
			`✔︎ Generated packet hash getters:\n${uniquePacketHashGetters.join(
				'\n'
			)}`
		)
	)

	return {
		setup: results,
		packetHashGetters: uniquePacketHashGetters,
		digestGetters: uniqueDigestGetters,
		signerGetters: uniqueSignerGetters
	}
}

export async function generate(config: Config) {
	const { setup: eip721Setup, packetHashGetters: eip712PacketHashGetters } =
		getSolidity(defaultConfig)

	const { setup, packetHashGetters, digestGetters, signerGetters } =
		getSolidity(config)

	// Combine the EIP-721 and EIP-712 types.
	const combinedSetup = [...eip721Setup, ...setup]
	const combinedPacketHashGetters = [
		...eip712PacketHashGetters,
		...packetHashGetters
	]

	const lines: string[] = [
		`// SPDX-License-Identifier: ${config.contract.license}\n`,
		`pragma solidity ${config.contract.solidity};\n`,
		`import {ECDSA} from 'solady/src/utils/ECDSA.sol';\n`,
		`/**
 * @title Framework:${config.contract.name}
 * @notice The base EIP-712 types that power a modern intent framework.
 * @dev This file was auto-generated by @nftchance/emporium-types/cli 
 *      and should not be edited directly otherwise the alchemy 
 *      will fail and you will have to pay with a piece of your soul.
 *      (https://github.com/nftchance/emporium-types)
 * @dev This interface and the consuming abstract are auto-generated by
 *      types declared in the framework configuration at (./config.ts). 
 *      As an extensible base, all projects build on top of Delegations 
 *      and Invocations.
${config.contract.authors}
 */`,
		`interface I${config.contract.name} {`
	]

	const structs: string[] = []
	const typeHashes: string[] = []

	combinedSetup.forEach(type => {
		structs.push(type.struct)
		typeHashes.push(type.typeHash)
	})

	// * Interface struct declarations.
	lines.push(structs.join('\n\n'))

	lines.push(`}

/**
 * @title Framework:${config.contract.name} 
 * @dev This file was auto-generated by @nftchance/emporium-types/cli.
 *      (https://github.com/nftchance/emporium-types)
 * @dev This abstract contract is auto-generated and should not be edited directly
 *      however it should be directly inherited from in the consuming protocol
 *      to power the processing of generalized intents.
${config.contract.authors}
 */
abstract contract ${config.contract.name} is I${config.contract.name} {
    /// @notice Use the ECDSA library for signature verification.
    using ECDSA for bytes32;

    /// @notice The hash of the domain separator used in the EIP712 domain hash.
    bytes32 public immutable domainHash;`)

	// * Base abstract contract pieces.
	lines.push(typeHashes.join('\n'))

	lines.push(`\t/**
     * @notice Instantiate the contract with the name and version of the protocol.
     * @param $name The name of the protocol.
     * @param $version The version of the protocol.
     * @dev The chainId is pulled from the block and the verifying contract is set to the
     *      address of the contract.
     */
    constructor(string memory $name, string memory $version) {
        /// @dev Sets the domain hash for the contract.
        domainHash = getPacketHash(EIP712Domain({
            name: $name,
            version: $version,
            chainId: block.chainid,
            verifyingContract: address(this)
        }));
    }\n`)

	// * Packet hash getters.
	lines.push(combinedPacketHashGetters.join('\n'))

	// * Digest getters.
	lines.push(digestGetters.join('\n\n'))

	// * Signer getters.
	lines.push(signerGetters.join('\n\n'))

	lines.push('}')

	return lines.join('\n')
}
