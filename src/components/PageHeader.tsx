import { motion, type Variants } from "framer-motion";

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const PageHeader = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) => {

  return (
    <motion.div variants={itemVariants} className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-primary">{title}</h1>
          <p className="text-muted-foreground mt-2 text-lg">{description}</p>
        </div>
        {children}
      </div>
    </motion.div>
  );
};

export default PageHeader;
