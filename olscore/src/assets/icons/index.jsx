import { ReactComponent as Attachment } from "./svgs/attachment.svg";
import { ReactComponent as BreadcrumbDivider } from "./svgs/breadcrumb-divider.svg";
import { ReactComponent as ContactBook } from "./svgs/contact-book.svg";
import { ReactComponent as DividerDash } from "./svgs/divider-dash.svg";
import { ReactComponent as Home } from "./svgs/home.svg";
import { ReactComponent as InformationSquare } from "./svgs/information.svg";
import { ReactComponent as Question } from "./svgs/question-filled.svg";
import { ReactComponent as List } from "./svgs/list.svg";
import { ReactComponent as Message } from "./svgs/message.svg";
import { ReactComponent as MessageDot } from "./svgs/message-dot.svg";
import { ReactComponent as Note } from "./svgs/note.svg";
import { ReactComponent as NumbericalStar } from "./svgs/numerical-star.svg";
import { ReactComponent as Online } from "./svgs/online.svg";
import { ReactComponent as Offline } from "./svgs/offline.svg";
import { ReactComponent as Peoples } from "./svgs/peoples.svg";
import { ReactComponent as PlusCourse } from "./svgs/plus-course.svg";
import { ReactComponent as Radio } from "./svgs/radio.svg";
import { ReactComponent as RadioChecked } from "./svgs/radio-checked.svg";
import { ReactComponent as Send } from "./svgs/send.svg";

import { ReactComponent as PlayVideo } from "./video/play-video.svg";
import { ReactComponent as Success } from "./svgs/success.svg";
import { ReactComponent as SuccessGray } from "./svgs/success-gray.svg";
import { ReactComponent as Clock } from "./clock.svg";
import { ReactComponent as Notification } from "./svgs/notification.svg";
import { ReactComponent as Search } from "./toolbar/search.svg";
import { ReactComponent as Photo } from "./photo.svg";

import { ReactComponent as User } from "./auth/user.svg";
import { ReactComponent as UserOutlined } from "./auth/user-outlined.svg";
import { ReactComponent as Inbox } from "./auth/inbox.svg";
import { ReactComponent as Key } from "./auth/key.svg";

import { ReactComponent as ListStyle } from "./content/list-icon.svg";

import { ReactComponent as CourseBadge } from "./course/badge.svg";
import { ReactComponent as CourseDownload } from "./course/download.svg";
import { ReactComponent as CourseSyllabus } from "./course/syllabus.svg";
import { ReactComponent as CourseMaterial } from "./course/material.svg";
import { ReactComponent as CourseMaterialFilled } from "./course/material-filled.svg";
import { ReactComponent as CourseQuiz } from "./course/quiz.svg";
import { ReactComponent as CourseQuizFilled } from "./course/quiz-filled.svg";
import { ReactComponent as CourseAssignment } from "./course/assignment.svg";
import { ReactComponent as CourseAssignmentFilled } from "./course/assignment-filled.svg";
import { ReactComponent as CoursePoll } from "./course/poll.svg";
import { ReactComponent as CoursePollFilled } from "./course/poll-filled.svg";

import { ReactComponent as ActionLike } from "./actions/like.svg";
import { ReactComponent as ActionWarning } from "./actions/warning.svg";
import { ReactComponent as ActionChevronDown } from "./actions/chevron-down.svg";
import { ReactComponent as ActionChevronLeft } from "./actions/chevron-left.svg";
import { ReactComponent as ActionChevronRight } from "./actions/chevron-right.svg";
import { ReactComponent as ActionChevronUp } from "./actions/chevron-up.svg";
import { ReactComponent as ToggleClosed } from "./actions/step-nav-toggle-close.svg";
import { ReactComponent as ToggleOpened } from "./actions/step-nav-toggle.svg";

import { ReactComponent as Download } from "./actions/download.svg";
import { ReactComponent as Refresh } from "./actions/refresh.svg";

import { ReactComponent as DashboardIcon } from "./sidebar/dashboard.svg";
import { ReactComponent as CalenderIcon } from "./sidebar/calendar.svg";
import { ReactComponent as MessageIcon } from "./sidebar/message.svg";
import { ReactComponent as ContactInfo } from "./sidebar/chat-info.svg";
// import { ReactComponent as ActionChevronDown } from "./actions/chevron-down.svg";

const Icons = {
  Attachment,
  BreadcrumbDivider,
  ContactBook,
  Clock,
  DividerDash,
  Home,
  InformationSquare,
  List,
  ListStyle,
  Message,
  MessageDot,
  Note,
  Notification,
  NumbericalStar,
  Online,
  Offline,
  Peoples,
  Photo,
  PlusCourse,
  PlayVideo,
  Question,
  Radio,
  RadioChecked,
  Search,
  Send,
  Success,
  SuccessGray,
  Auth: {
    User,
    Key,
    UserOutlined,
    Inbox,
  },
  Sidebar: {
    Dashboard: DashboardIcon,
    Calendar: CalenderIcon,
    Message: MessageIcon, 
    Contact: ContactInfo  
  },
  Course: {
    Badge: CourseBadge,
    Download: CourseDownload,
    Syllabus: CourseSyllabus,
    Material: CourseMaterial,
    MaterialFilled: CourseMaterialFilled,
    Quiz: CourseQuiz,
    QuizFilled: CourseQuizFilled,
    Poll: CoursePoll,
    PollFilled: CoursePollFilled,
    Assignment: CourseAssignment,
    AssignmentFilled: CourseAssignmentFilled,
  },
  Action: {
    ChevronDown: ActionChevronDown,
    ChevronLeft: ActionChevronLeft,
    ChevronRight: ActionChevronRight,
    ChevronUp: ActionChevronUp,
    Refresh,
    Download,
    Like: ActionLike,
    Warning: ActionWarning,
    ToggleOpened: ToggleOpened,
    ToggleClosed: ToggleClosed,
  },
};

export default Icons;
