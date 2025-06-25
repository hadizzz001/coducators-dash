import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      title,
      level,
      duration,
      age,
      category,
      subcategory,
      description,
      img,
      soon,
      sessions,
      pair,
      group,
      pre,
    } = body;

    const product = await prisma.course.create({
      data: {
        title,
        level,
        duration,
        age,
        category,
        subcategory,
        description,
        img,
        soon,
        sessions,
        pair,
        group,
        pre,
      },
    });

    return new Response(JSON.stringify({ message: 'Product created successfully', product }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return new Response(JSON.stringify({ error: 'Failed to create product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(req) {
  try {
    const products = await prisma.course.findMany();
    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(req) {
  try {
    const deleted = await prisma.course.deleteMany(); // delete all courses
    return new Response(JSON.stringify({
      message: 'All courses deleted successfully',
      deletedCount: deleted.count,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting courses:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete courses' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
