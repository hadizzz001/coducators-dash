import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const {   
      title       ,
      subtitle    ,
      student     ,
      age         ,
      description ,
      img         ,
      video       ,
      course       ,
      } = body;

console.log("body are: ",body);



    const product = await prisma.project.create({
      data: {
        title       ,
        subtitle    ,
        student     ,
        age         ,
        description ,
        img         ,
        video       ,
        course       ,
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
    const products = await prisma.project.findMany({
      
    });

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



export async function PATCH(req) {
  try {
    const updated = await prisma.project.updateMany({
      data: { course: 'Course 2' },
    });

    return new Response(JSON.stringify({ message: 'Course updated for all projects', updated }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating course for all projects:', error);
    return new Response(JSON.stringify({ error: 'Failed to update course for all projects' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
