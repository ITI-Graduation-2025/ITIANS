// app/jihan/companies/[companyId]/page.jsx


"use client";

import CompanyPublicProfile from "@/components/ui/CompanyPublicProfile";


export default function Page({ params }) {
  return <CompanyPublicProfile params={params} />;
}


