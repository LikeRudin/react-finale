import { NextPage } from "next";

const MeetDetail = () => {
  return (
    <div>
      <div>
        <div />
        <div>
          <div />
          <div>
            <p>Alicia keys</p>
            <p>view profile &rarr;</p>
          </div>
        </div>
        <div>
          <h1>if i Ain't got you</h1>
          <p>3:29</p>
          <p>
            some people want it all, but i don't want nothing at all if i ain't
            you baby, if i ain't got you baby, some people want diamond rings
            Some just want everything. but everything is nothing, if i ain't got
            you
          </p>
          <div>
            <button>Join this meet</button>
            <button>
              <svg
                className="h-6 w-6 "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div>
        <h2>other meets</h2>
        <div>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item}>
              <div />
              <h3>Mogakko</h3>
              <p>hello</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetDetail;
