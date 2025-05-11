import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update Product API
export async function PATCH(request, { params }) {
  const { id } = params;
  const {
    title       ,
    level       ,
    duration    ,
    age         ,
    category    ,
    subcategory ,
    description ,
    img         ,
    soon,
     
  } = await request.json();

  console.log("imgs are: ", img);
  

  try {
    // Update product and its specifications
    const updatedProduct = await prisma.course.update({
      where: { id },
      data: {
        title       ,
        level       ,
        duration    ,
        age         ,
        category    ,
        subcategory ,
        description ,
        img         ,
        soon         ,
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

// Delete Product API
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
 

    // Delete the product
    await prisma.course.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: 'Product deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete product' }),
      { status: 500 }
    );
  }
}

