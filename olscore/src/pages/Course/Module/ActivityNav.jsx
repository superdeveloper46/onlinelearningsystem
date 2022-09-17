import React from "react";
import { useSearchParams } from "react-router-dom";
import clsx from "clsx";
import { ReactComponent as IconChevronLeft } from "../../../assets/icons/actions/chevron-left.svg";
import { ReactComponent as IconChevronRight } from "../../../assets/icons/actions/chevron-right.svg";

const getNextActivityId = (activities, actId) => {
  const index = activities.findIndex((item) => item.ActivityId === actId);
  if (index < activities.length - 1) {
    return activities[index + 1].ActivityId;
  } else {
    return actId;
  }
};

const getPrevActivityId = (activities, actId) => {
  const index = activities.findIndex((item) => item.ActivityId === actId);
  if (index >= 1) {
    return activities[index - 1].ActivityId;
  } else {
    return actId;
  }
};
function ActivityNav({ activities, activity }) {
  const [, setSearchParams] = useSearchParams();

  return (
    <>
      <button
        className={clsx("btn-action-outline mx-2")}
        disabled={activity?.ActivityId === activities[0].ActivityId}
        onClick={() => {
          setSearchParams({
            ActivityId: getPrevActivityId(activities, activity?.ActivityId),
          });
        }}
      >
        <IconChevronLeft></IconChevronLeft>
      </button>
      <button
        className="btn-action-outline"
        disabled={activity?.ActivityId === activities[activities.length - 1].ActivityId}
        onClick={() => {
          setSearchParams({
            ActivityId: getNextActivityId(activities, activity?.ActivityId),
          });
        }}
      >
        <IconChevronRight></IconChevronRight>
      </button>
    </>
  );
}

export default ActivityNav;
