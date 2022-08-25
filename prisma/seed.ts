import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

async function delay() {
  return new Promise((resolve) => setTimeout(resolve, 100));
}

async function main() {
  for (const i of [...Array.from(Array(50).keys())]) {
    await client.tweet.create({
      data: {
        title: i + "",
        content: i + "",
        user: { connect: { id: 1 } },
      },
    });
    console.log(`${i}/50`);
    await delay();
  }
}

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect());

// 더미 데이터 빠르게 생성
