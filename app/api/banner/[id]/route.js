import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update Product API
export async function PATCH(request, { params }) {
  const { id } = params;
  const {
    img,
    title,
    sub,
    desc,
    btn1,
    btn2,

  } = await request.json();

  console.log("imgs are: ", img);


  try {
    // Update product and its specifications
    const updatedProduct = await prisma.banner.update({
      where: { id },
      data: {
        img,
        title,
        sub,
        desc,
        btn1,
        btn2,
      },
    });

    return new Response(JSON.stringify(updatedProduct), { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update product' }),
      { status: 500 }
    );
  }
}

