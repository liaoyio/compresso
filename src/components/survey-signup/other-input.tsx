import { useState } from "react";
import { SurveyButton } from "../survey/survey-button";
import { Input } from "../ui/input";

export const OtherInput = ({
  onSubmit,
}: {
  onSubmit: (other: string) => void;
}) => {
  const [other, setOther] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!isEditing) {
    return (
      <SurveyButton onClick={() => setIsEditing(true)}>Other</SurveyButton>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <Input
        value={other}
        onChange={(e) => setOther(e.target.value)}
        autoFocus
        placeholder="Enter your answer"
        className="grow py-7 text-lg w-full"
      />
      <SurveyButton
        className="bg-foreground text-background hover:bg-foreground active:bg-foreground/80"
        onClick={() => onSubmit(other)}
      >
        Submit
      </SurveyButton>
      <button
        className="active:text-foreground/80"
        onClick={() => setIsEditing(false)}
      >
        Cancel
      </button>
    </div>
  );
};
