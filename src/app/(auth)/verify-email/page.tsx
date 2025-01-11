import { verifyEmail } from "@/app/actions/authActions";
import CardWrapper from "@/components/CardWrapper";
import ResultMessage from "@/components/ResultMessage";
import { Spinner } from "@nextui-org/react";
import React from "react";
import { MdOutlineMailOutline } from "react-icons/md";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const SearchParams = await searchParams;

  const result = await verifyEmail(SearchParams.token);
  return (
    <>
      <CardWrapper
        headerText="Verify Your email address"
        headerIcon={MdOutlineMailOutline}
        body={
          <div className="flex flex-col space-y-4 items-center">
            <div className="flex flex-row items-center">
              <p>Verifying your email address. Please wait...</p>
              {!result && <Spinner color="secondary" />}
            </div>
          </div>
        }
        footer={<ResultMessage result={result} />}
      />
    </>
  );
}