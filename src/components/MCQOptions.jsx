import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

export default function MCQOptions({
  themeColor,
  handleOptionSelect,
  options
}) {
  return (
    <ButtonGroup vertical className="special">
      {options.map((opt, idx) => (
        <Button
          key={`${idx}-${opt}`}
          value={idx}
          variant={`outline-${themeColor}`}
          onClick={handleOptionSelect}
        >
          {opt}
        </Button>
      ))}
    </ButtonGroup>
  );
}
