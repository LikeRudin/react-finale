import { GetServerSideProps, NextPage } from "next";
import Button from "@/pages/components/button";
import Layout from "@/pages/components/layout";
import client from "@/libs/server/prisma-client";
import { MeetUp } from "@prisma/client";
import Link from "next/link";

interface HomeProps {
  meetUps: (MeetUp & {
    user: { username: string };
    comments: any[];
    joins: any[];
    likes: any[];
  })[];
}

const Home: NextPage<HomeProps> = ({ meetUps }) => {
  return (
    <Layout hasBottomBar title="모여서함께" seoTitle="모여서함께">
      <div className="w-full max-w-xl h-full flex flex-col justify-start    ">
        {meetUps?.map((item, index) => {
          const {
            user: { username },
            id,
            name,
            createdAt,
            schedule,
            comments,
            joins,
            likes,
            location,
          } = item;
          return (
            <Link
              href={`/meets/${id}`}
              key={index}
              className="pt-3 flex justify-between px-4 border-b pb-5 cursor-pointer hover:bg-emerald-900"
            >
              <div className="flex space-x-4">
                <div className="w-20 aspect-square bg-orange-400 rounded-md" />
                <div className="pt-2 flex-col">
                  <h3 className="text-md font-medium text-gray-300">{name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                    <span>
                      {schedule
                        .toString()
                        .split("T")
                        .map((word, index) =>
                          !index ? `${word} ` : word.slice(0, 5)
                        )}
                    </span>
                    <p>/</p>
                    <span>{location}</span>
                  </div>
                  <span className="font-medium mt-1 text-sm text-gray-400">
                    {`host: ${String(username)}`}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2 items-end justify-end">
                <div className="flex space-x-0.5 items-center text-sm text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                    />
                  </svg>
                  <span>{joins.length}</span>
                </div>
                <div className="flex space-x-0.5 items-center text-sm text-gray-300">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    ></path>
                  </svg>
                  <span>{likes.length}</span>
                </div>
                <div className="flex space-x-0.5 items-center text-sm text-gray-300">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    ></path>
                  </svg>
                  <span>{comments.length}</span>
                </div>
              </div>
            </Link>
          );
        })}
        <Button tooltip="New MeetUp" linkAddress="/meets/upload" />
      </div>
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const meetUps = await client.meetUp.findMany({
    select: {
      name: true,
      id: true,
      schedule: true,
      comments: true,
      likes: true,
      joins: true,
      location: true,
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      schedule: "desc",
    },
  });
  return {
    props: {
      meetUps: JSON.parse(JSON.stringify(meetUps)),
    },
  };
};
