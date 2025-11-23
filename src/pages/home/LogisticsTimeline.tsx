import React, { useState } from "react";
import { motion } from "framer-motion";
import icon from "../../assets/Grupo-icon.png";
import timeline from "../../assets/Grupoline.png";

const LogisticsTimeline: React.FC = () => {
  const [pauseTop, setPauseTop] = useState(false);
  const [pauseBottom, setPauseBottom] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="w-full bg-[#026432] py-24 overflow-x-hidden flex justify-center"
    >
      <div className="relative w-full max-w-[2100px] px-4">

        {/* 🔵 TOP ICON – AUTO LOOP */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="w-full overflow-hidden mb-10"
          onMouseEnter={() => setPauseTop(true)}
          onMouseLeave={() => setPauseTop(false)}
        >
          <div
            className="flex will-change-transform animate-scrollX"
            style={{ animationPlayState: pauseTop ? "paused" : "running" }}
          >
            <img
              src={icon}
              alt="Icon Row"
              className="min-w-[2000px] max-w-none h-auto object-contain select-none"
              draggable={false}
            />
            <img
              src={icon}
              alt="Icon Row Duplicate"
              className="min-w-[2000px] max-w-none h-auto object-contain select-none"
              draggable={false}
            />
          </div>
        </motion.div>

        {/* 🟢 TIMELINE – AUTO LOOP */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-full overflow-hidden"
          onMouseEnter={() => setPauseBottom(true)}
          onMouseLeave={() => setPauseBottom(false)}
        >
          <div
            className="flex will-change-transform animate-scrollX"
            style={{ animationPlayState: pauseBottom ? "paused" : "running" }}
          >
            <img
              src={timeline}
              alt="Timeline"
              className="min-w-[2500px] max-w-none h-auto object-contain select-none"
              draggable={false}
            />
            <img
              src={timeline}
              alt="Timeline Duplicate"
              className="min-w-[2500px] max-w-none h-auto object-contain select-none"
              draggable={false}
            />
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default LogisticsTimeline;
