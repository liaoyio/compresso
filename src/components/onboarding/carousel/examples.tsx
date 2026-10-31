// import { motion } from "framer-motion";

import { useEffect, useState } from "react";
// import { Arrows } from "./arrows";
import SizeChart from "./chart";

export const delay = 5000;

export const Example = () => {
  // pick a random example every 2 seconds
  const [example, setExample] = useState(examples[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setExample(examples[Math.floor(Math.random() * examples.length)]);
    }, delay);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center ">
      <SizeChart
        key={example.title}
        original={example.originalSize}
        compressed={example.compressedSize}
        type={example.title}
      />
    </div>
  );
};

const examples = [
  {
    title: "Screen recording",
    duration: "23 min",
    originalSize: 1.2e9,
    compressedSize: 1e8,
    count: 2,
  },
  {
    title: "Camera footage",
    duration: "2 hours",
    originalSize: 5.2e9,
    compressedSize: 7e8,
    count: 5,
  },
  {
    title: "Gameplay",
    duration: "5 hours",
    originalSize: 5e10,
    compressedSize: 6.2e9,
    count: 8,
    illustration: null,
  },
  {
    title: "Drone footage",
    duration: "30 min",
    originalSize: 5e9,
    compressedSize: 1e9,
    count: 4,
    illustration: null,
  },
  {
    title: "Security camera",
    duration: "12 hours",
    originalSize: 5e10,
    compressedSize: 5e9,
    count: 4,
    illustration: null,
  },
];
