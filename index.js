
const {Connection, Keypair, clusterApiUrl, TOKEN_PROGRAM_ID, PublicKey} = require('@solana/web3.js')
const {createMint, getOrCreateAssociatedTokenAccount, mintTo} = require('@solana/spl-token')

const payer = Keypair.fromSecretKey(Uint8Array.from([135,205,106,46,161,193,182,234,102,97,228,7,76,146,213,95,136,145,228,110,68,92,174,199,12,232,191,7,164,4,241,49,214,120,97,220,4,215,72,208,32,163,57,25,157,255,209,113,136,136,34,72,26,80,142,171,8,123,39,116,199,173,168,131]))
const mintAuthority = payer 
const connection = new Connection(clusterApiUrl('devnet'))

async function createMintForToken(payer, mintAuthority) {
    const mint = await createMint(
        connection,
        payer,
        mintAuthority,
        null,
        9,
        TOKEN_PROGRAM_ID
    )
    console.log(mint.toBase58())
    return mint

}

async function mintNewTokens(mint, payer, to) {
   const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    new PublicKey(to)
   )
    console.log('token created at: '+ tokenAccount.address)

    await mintTo(
        connection,
        payer,
        mint,
        tokenAccount.address,
        payer,
        100
    )
    console.log('minted 100 tokens to ' + tokenAccount.address)
    
}

async function main() {
    const mint = await createMintForToken(payer, mintAuthority.publicKey)
    console.log(mint, mint.toBase58())
    await mintNewTokens(mint, payer, mintAuthority.publicKey)
}

main()