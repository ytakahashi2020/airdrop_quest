import { create, mplCore } from "@metaplex-foundation/mpl-core";
import {
  createGenericFile,
  generateSigner,
  keypairIdentity
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { base58 } from "@metaplex-foundation/umi/serializers";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

/**
 * NFT作成用のAPI
 * @returns
 */
export async function POST() {
  try {
    // UMI インスタンスを作成する。
    const umi = createUmi("https://api.devnet.solana.com")
    .use(mplCore())
    .use(
      irysUploader({
        
        address: "https://devnet.irys.xyz",
      })
    );

    // バックエンド用の鍵ペアを読み込む
    const keyData = fs.readFileSync(path.join(process.cwd(), "src", "data", "id.json"));
    const walletFile = JSON.parse(keyData.toString());
    // キーペアを作成
    let keypair = umi.eddsa.createKeypairFromSecretKey(
      new Uint8Array(walletFile)
    );
    // バックエンド用の鍵ペアとUMIを紐付ける。
    umi.use(keypairIdentity(keypair));

    // Upload image data
    const imageFile = fs.readFileSync(path.join(process.cwd(), 'public/images/enemy1.png'));
    const umiImageFile = createGenericFile(imageFile, "image.png", {
      tags: [{ name: "Content-Type", value: "image/png" }],
    });
    console.log("Uploading Image...");
    // upload
    const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
      throw new Error(err);
    });
    const irysImageUri = imageUri[0].replace("arweave.net", "gateway.irys.xyz");
    console.log("imageUri: " + irysImageUri);

    const metadata = {
      name: "Q Drop Adventure Winner NFT",
      description: "This is a Q Drop Adventure Winner NFT",
      image: irysImageUri,
      external_url: "https://x.com/a_kingdom_radar",
      attributes: [
        {
          trait_type: "rarity",
          value: "max",
        },
      ],
      properties: {
        files: [
          {
            uri: imageUri[0],
            type: "image/jpeg",
          },
        ],
        category: "image",
      },
    };
  
    // Call upon umi's `uploadJson` function to upload our metadata to Arweave via Irys.
  
    console.log("Uploading Metadata...");
    const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
      throw new Error(err);
    });

    const irysMetadataUri = metadataUri.replace(
      "arweave.net",
      "gateway.irys.xyz"
    );
  
    console.log("metadataUri: " + irysMetadataUri);

    const asset = generateSigner(umi);

  console.log("Creating NFT...");
  // NFTを作成するトランザクションを署名して送信
  const tx = await create(umi, {
    asset,
    name: "My Super NFT",
    uri: irysMetadataUri,
  }).sendAndConfirm(umi);

  // Finally we can deserialize the signature that we can check on chain.
  const signature = base58.deserialize(tx.signature)[0];

  // Log out the signature and the links to the transaction and the NFT.
  console.log("\nNFT Created");
  console.log("View Transaction on Solana Explorer");
  console.log(`https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  console.log("\n");
  console.log("View NFT on Metaplex Explorer");
  console.log(
    `https://core.metaplex.com/explorer/${asset.publicKey}?env=devnet`
  );

  return NextResponse.json({
    txHash: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
    metaplexUrl: `https://core.metaplex.com/explorer/${asset.publicKey}?env=devnet`,
  })

  } catch (error) {
    console.error("error:", error);
    throw error;
  }
}