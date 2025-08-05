"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const PageHeader = ({
  icon,
  title,
  backLink = "/",
  backLabel = "Back to Home",
}) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col justify-between gap-5 mb-8"
    >
      <div>
        <Link href={backLink} passHref legacyBehavior>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mb-2 border-sky-900/30"
          >
            <a>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {backLabel}
            </a>
          </Button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-end gap-2"
      >
        {icon && (
          <div className="text-sky-400">
            {React.isValidElement(icon)
              ? React.cloneElement(icon, {
                  className: `${
                    (icon.props && icon.props.className) || ""
                  } h-12 md:h-14 w-12 md:w-14`,
                })
              : icon}
          </div>
        )}
        <h1 className="text-4xl md:text-5xl gradient-title">{title}</h1>
      </motion.div>
    </motion.div>
  );
};

export default PageHeader;