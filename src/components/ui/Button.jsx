"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

const variants = {
    primary:
        "bg-primary-main text-white hover:bg-primary-light",

    secondary:
        "bg-secondary-main text-main hover:bg-secondary-dark",

    outline:
        "border border-primary-main text-primary-main hover:bg-primary-main hover:text-white",

    ghost:
        "text-main hover:bg-secondary-main",

    danger:
        "bg-red-main text-white hover:bg-red-dark",
};

const sizes = {
    sm: "h-9 px-4 body-small",
    md: "h-11 px-6 body-default",
    lg: "h-13 px-8 body-large",
};

const Button = forwardRef(
    (
        {
            children,
            className,
            variant = "primary",
            size = "md",
            loading = false,
            disabled = false,
            leftIcon,
            rightIcon,
            as = "button",
            href,
            ...props
        },
        ref
    ) => {
        const classes = cn(
            "inline-flex items-center justify-center gap-2 rounded-r16 transition-all duration-300 cursor-pointer",
            "disabled:opacity-50 disabled:pointer-events-none",
            variants[variant],
            sizes[size],
            className
        );

        const content = (
            <>
                {loading && (
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                )}

                {!loading && leftIcon}

                {children}

                {!loading && rightIcon}
            </>
        );

        /* ---------------- Render as Link ---------------- */

        if (as === "link" && href) {
            const isDisabled = disabled || loading;

            return (
                <Link
                    ref={ref}
                    href={href}
                    aria-disabled={isDisabled}
                    tabIndex={isDisabled ? -1 : undefined}
                    className={cn(
                        classes,
                        isDisabled && "opacity-50 pointer-events-none"
                    )}
                    {...props}
                >
                    {content}
                </Link>
            );
        }

        /* ---------------- Render as Button ---------------- */

        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={classes}
                {...props}
            >
                {content}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;