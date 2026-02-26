import prisma from '@/lib/db';

export default async function sitemap() {
  const products = await prisma.product.findMany({
    select: { id: true, updatedAt: true },
  });

  const productUrls = products.map((product) => ({
    url: `https://phonemarket.com/phone/${product.id}`,
    lastModified: product.updatedAt,
  }));

  return [
    { url: 'https://phonemarket.com', lastModified: new Date() },
    ...productUrls,
  ];
}
