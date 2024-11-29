const anchor = require("@project-serum/anchor");

const main = async () => {
  try {
    console.log("Starting tests...");

    const provider = anchor.Provider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.Gifportal;

    const baseAccount = anchor.web3.Keypair.generate();
    const tx = await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [baseAccount],
    });

    console.log("Your transaction signature", tx);

    let account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("GIF Count", account.totalGifs.toString());

    await program.rpc.addGif(
      "https://64.media.tumblr.com/9f40b42c8ae4c3ac105dbbba8d2e6e52/tumblr_oz1117X2dP1tfw70go2_500.gifv",
      {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      }
    );

    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("GIF Count", account.totalGifs.toString());
    console.log("GIF List", account.gifList);
  } catch (error) {
    console.error("Error in main:", error);
  }
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error("Error running main:", error);
    process.exit(1);
  }
};

runMain();
