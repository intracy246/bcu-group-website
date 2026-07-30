import CareerForm from"@/components/admin/CareerForm";import{prisma}from"@/lib/prisma";
export default async function Page(){const companies=await prisma.company.findMany({where:{status:"ACTIVE"},select:{id:true,name:true}});return <CareerForm companies={companies}/>;}
