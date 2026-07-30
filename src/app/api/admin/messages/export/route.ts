import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
const cell = (value: string) => `"${value.replaceAll('"', '""')}"`;
export async function GET() {
  await requireUser(["SUPER_ADMIN","ADMIN"]);
  const rows=await prisma.contactMessage.findMany({orderBy:{createdAt:"desc"}});
  const csv=["Name,Email,Phone,Organisation,Subject,Status,Created",...rows.map(row=>[row.name,row.email,row.phone??"",row.organisation??"",row.subject,row.status,row.createdAt.toISOString()].map(cell).join(","))].join("\r\n");
  return new Response(csv,{headers:{"content-type":"text/csv; charset=utf-8","content-disposition":'attachment; filename="bcu-messages.csv"'}});
}
