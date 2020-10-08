import { isAddress } from "@ethersproject/address";
import { useWeb3React } from "@web3-react/core";
import {
  ProposalStatusBadge,
  ProposalTypeBadge,
} from "components/GovernanceProposal";
import GovernanceProposalHistory from "components/GovernanceProposalHistory";
// import GovernanceProposalVoteHistory from "components/GovernanceProposalVoteHistory";
import GovernanceProposalVotePanel from "components/GovernanceProposalVotePanel";
import dayjs from "dayjs";
import useProposalData from "hooks/governance/useProposalData";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import ReactMarkdown from "react-markdown";
import LinkArrow from "svgs/LinkArrow";
import getEtherscanLink from "util/getEtherscanLink";

export default function ProposalView() {
  const { query } = useRouter();

  const { chainId } = useWeb3React();

  const { id } = query;

  const data = useProposalData(id);

  const formatDate = dayjs.unix(data?.date).format("MMM D, YYYY");

  const linkIfAddress = (content) => {
    if (isAddress(content) && chainId) {
      return (
        <a
          className="underline"
          href={getEtherscanLink(chainId, content, "address")}
        >
          {content}
        </a>
      );
    }

    return <span>{content}</span>;
  };

  return (
    <Fragment>
      <h1 hidden>Proposal</h1>

      <div className="container-lg">
        {/* Spacer */}
        <div className="h-8" />

        <div>
          <Link href="/governance">
            <a className="font-semibold inline-flex align-middle items-center">
              <LinkArrow.Left /> <span className="ml-1">Back</span>
            </a>
          </Link>
        </div>

        {/* Spacer */}
        <div className="h-8" />

        <div className="grid grid-cols-12">
          <div className="col-span-7">
            <h1>{data?.title}</h1>

            {/* Spacer */}
            <div className="h-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ProposalTypeBadge type="Onchain" className="bg-white" />
                <p className="text-type-light">Executed on {formatDate}</p>
              </div>
              <ProposalStatusBadge status={data?.status} />
            </div>

            {/* Spacer */}
            <div className="h-12" />

            <h2 className="text-xl">Summary</h2>

            {/* Spacer */}
            <div className="h-4" />

            <ol className="divide-y border-t border-b">
              {data?.details.map((d, i) => (
                <li
                  key={i}
                  className="py-4 flex space-x-4 break-words break-all"
                >
                  <span className="font-semibold">{i + 1}</span>
                  <p className="">
                    {linkIfAddress(d.target)}.{d.functionSig}(
                    {d.callData.split(",").map((content, i) => {
                      return (
                        <span key={i}>
                          {linkIfAddress(content)}
                          {d.callData.split(",").length - 1 === i ? "" : ","}
                        </span>
                      );
                    })}
                    )
                  </p>
                </li>
              ))}
            </ol>

            {/* Spacer */}
            <div className="h-4" />

            <div className="space-y-4 font-normal text-lg">
              <ReactMarkdown
                renderers={{
                  link: (props) => <a className="underline" {...props} />,
                }}
              >
                {data?.description}
              </ReactMarkdown>
            </div>

            {/* Spacer */}
            {/* <div className="h-12" /> */}

            {/* <GovernanceProposalVoteHistory id={id} /> */}
          </div>

          <div className="col-span-1" />

          <div className="col-span-4">
            <GovernanceProposalVotePanel
              id={id}
              forCount={data?.forCount}
              againstCount={data?.againstCount}
            />

            {/* Spacer */}
            <div className="h-8" />

            <GovernanceProposalHistory id={id} />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
