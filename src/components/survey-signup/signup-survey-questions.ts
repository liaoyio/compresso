import { SurveyQuestion } from "../survey/types";

export const signupSurveyId = "signup";

export const signupQuestions: SurveyQuestion[] = [
  {
    id: "signup-first-thing",
    message: "Welcome to Compresso!",
    question: "What's in the first video you'll compress?",
    options: [
      "Screen recording",
      //   "Meme or other fun",
      //   "Meeting recordings",
      "Content for social media",
      "Content for website",
      "Video of family or friends",
    ],
    allowOther: true,
  },
  {
    id: "signup-what",
    message: "Nice!",
    question: "What will you do with it?",
    options: [
      "Post on social media",
      "Discord",
      "Messaging app",
      "Creative app (like Figma)",
      "Hosting on the web",
      "Email",
      "Archiving",
    ],
    allowOther: true,
  },
  {
    id: "signup-heard",
    message: "Thanks! We're curious...",
    question: "How did you hear about this app?",
    options: [
      "Friend",
      "Social media",      
      "Online forum",
      "Podcast",
      "Youtube",
      "Reddit",
      "Blog",
    ],
    allowOther: true,
  },
  {
    id: "signup-who",
    message: "Thanks! Just one more thing...",
    question: "What best describes you?",
    options: [
      "Marketing person",
      "Designer",
      "Developer",
      "Videographer",
      "Hobbyist",
      "Student",
    ],
    allowOther: true,
  },
];
