import { Avatar } from "@material-tailwind/react";

export function AvatarStack({interviewees}) {
    return (
        <div className="flex items-center -space-x-4">
            <Avatar
                variant="circular"
                alt="user 1"
                className="border-2 border-white hover:z-10 focus:z-10 w-[40px] h-[40px]"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
            />
            <Avatar
                variant="circular"
                alt="user 2"
                className="border-2 border-white hover:z-10 focus:z-10 w-[40px] h-[40px]"
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80"
            />
            <div className = "relative">
                <Avatar
                    variant="circular"
                    className="border-2 border-white hover:z-10 focus:z-10 w-[40px] h-[40px] bg-red-200 "

                />
                <span className="absolute text-white inset-0 flex justify-center items-center text-[13px] font-bold">+{ interviewees }</span>
            </div>

        </div>
    );
}