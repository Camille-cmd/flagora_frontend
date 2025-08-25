import {ReactNode, useState} from "react";

export const Tooltip = ({
                            message,
                            children,
                        }: {
    message: string;
    children: ReactNode;
}) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative flex flex-col items-center">
            {/* The trigger */}
            <span
                className="flex justify-center"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onClick={() => setShow((prev) => !prev)} // toggle on mobile tap
            >
        {children}
      </span>

            {/* Tooltip box */}
            <div
                className={`absolute bottom-full transform -translate-x-1/2 mb-1 px-3 py-1 text-xs font-rubik text-primary bg-darkblue-500 dark:bg-darkblue-800 rounded-md shadow-lg transition-opacity duration-200 ${
                    show ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
            >
                {message}
            </div>
        </div>
    );
};
