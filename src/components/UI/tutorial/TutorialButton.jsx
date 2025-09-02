import React, { useState } from "react";
import "./tutorial-styles.css";
import { ArrowLeft } from "../icons/ArrowLeft";
import { ArrowRight } from "../icons/ArrowRight";
import { useTranslations } from "../../../hooks/useTranslations";

export function TutorialButton({
  children,
  onClick,
  variant = "primary",      // 'primary' | 'secondary'
  isHighlighted = false,    // (kept for parity; not used originally)
  icon = null,              // 'arrow_left' | 'arrow_right'
  iconSize = 30,
  ...props
}) {
  const { getComponentLabels } = useTranslations();
  const UILabels = getComponentLabels("tutorialButton");

  const [isHovered, setIsHovered] = useState(false);

  // IDENTICAL color setup to your original
  const colorConfig = {
    primary: {
      text: "#272626",
      bg: "#FAE6D5",
      hoverBg: "#E5B688",
      iconColor: "#272626",
      hoverIconColor: "#272626",
    },
    secondary: {
      text: "#E5B688",
      bg: "#FAE6D5",
      hoverBg: "#E5B688",
      iconColor: "#272626",
      hoverIconColor: "#272626",
    },
  };
  const colors = colorConfig[variant];
  const currentIconColor = isHovered ? colors.hoverIconColor : colors.iconColor;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={[
        "tutorial-btn",
        `variant-${variant}`,
        isHovered ? "is-hovered" : "",
      ].join(" ")}
      style={props.style} // preserve your ability to override via props.style
      {...props}
    >
      {icon === "arrow_left" && (
        <ArrowLeft color={currentIconColor} size={iconSize} />
      )}
      {children ?? (variant === "primary" && icon === null ? UILabels.start : null)}
      {icon === "arrow_right" && (
        <ArrowRight color={currentIconColor} size={iconSize} />
      )}
    </button>
  );
}
