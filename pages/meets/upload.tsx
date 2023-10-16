import type { NextPage } from "next";

const Upload: NextPage = () => {
  return (
    <div>
      <div>
        <div>
          <label>
            <svg
              className="h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <input type="file" />
          </label>
        </div>
      </div>
      <div>
        <label>Time</label>
        <div>
          <div>
            <span>
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
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
          </div>
          <input type="month" placeholder="0:00" />
          <input type="week" placeholder="0:00" />
          <input type="time" placeholder="0:00" />
          <div>
            <span>GTM</span>
          </div>
        </div>
      </div>
      <div>
        <label>Description</label>
        <div>
          <textarea rows={4} />
        </div>
      </div>
      <button>Upload Meet up</button>
    </div>
  );
};
