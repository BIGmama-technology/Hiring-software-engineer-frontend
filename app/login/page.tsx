import Image from "next/image";
import { login, signup } from "./actions";
import nextLogo from "../../public/next.svg";

export default function LoginPage() {
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <form className="flex flex-col items-center justify-center gap-10">
        <div>
          <h1 className="font-semibold text-lg">
            Welcome to Collaborator Editor
          </h1>
        </div>

        {/* <label htmlFor="email">Email:</label> */}
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter your email"
          className="border-b-2 border-b-gray-300 py-1 px-2 w-full"
        />

        {/* <label htmlFor="password">Password:</label> */}
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter your password"
          className="border-b-2 border-b-gray-300 py-1 px-2 w-full"
        />

        <div className="flex flex-row items-center justify-around w-full ">
          <button
            className="text-white bg-black py-1 px-4 rounded-md
            transition-all duration-150 hover:bg-gray-600"
            formAction={login}
          >
            Log in
          </button>
          <button
            className="text-white bg-black py-1 px-4 rounded-md
           transition-all duration-150 hover:bg-gray-600"
            formAction={signup}
          >
            Sign up
          </button>
        </div>
        <div>
          <p>Made with :</p>
        </div>
        <div className="flex gap-10">
          <Image
            alt="liveblocks logo"
            src={"https://liveblocks.io/favicon-32x32.png"}
            width={100}
            height={100}
          />
          <Image alt="Nextjs logo" src={nextLogo} width={100} height={100} />
        </div>
      </form>
    </div>
  );
}
