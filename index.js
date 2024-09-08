
const {Connection, Keypair, clusterApiUrl, TOKEN_PROGRAM_ID, PublicKey} = require('@solana/web3.js')
const {createMint, getOrCreateAssociatedTokenAccount, mintTo} = require('@solana/spl-token')

const payer = Keypair.fromSecretKey(Uint8Array.from("your-secret-key"))
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