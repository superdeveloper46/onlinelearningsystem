import * as React from "react";
import clsx from "clsx";
import ActivityNav from "../ActivityNav";
import { ReactComponent as ImageCantopen } from "./cantopen.svg";

import { getActivity } from "../../../../apis/course";
import { LikeButton } from "../../../../components/buttons";
import { OlsLoader } from "../../../../components/loader";

import { ReactComponent as LinkIcon } from "./link.svg";
import { ReactComponent as ShareIcon } from "./share.svg";
import { ReactComponent as FullscreenIcon } from "./fullscreen.svg";
import { ReactComponent as SettingIcon } from "./setting.svg";
import { ReactComponent as PrintIcon } from "./print.svg";

import "./Material.scss";
import axios from "axios";

function Material({ activity, activities }) {
  const { ActivityId } = activity;
  const [isFullscreen, setFullscreen] = React.useState(false);
  const [materialURL, setMaterialURL] = React.useState("");
  const [isLoading, setLoading] = React.useState(true);
  const [canOpen, setCanOpen] = React.useState(false);
  const materialRef = React.useRef(null);

  React.useEffect(() => {
    if (isFullscreen) {
      document.body.style = "overflow: hidden";
    } else {
      document.body.style = "";
    }
  }, [isFullscreen]);

  React.useEffect(() => {
    setFullscreen(false);
    return () => {
      setFullscreen(false);
    };
  }, [activity]);

  React.useEffect(() => {
    setLoading(true);
    setCanOpen(false);
    getActivity("Material", ActivityId).then((data) => {
      setMaterialURL(data.Description);

      axios
        .get(data.Description, {
          timeout: 3000,
        })
        .then((res) => {
          if (
            res.headers["X-FRAME-OPTIONS"] &&
            res.headers["X-FRAME-OPTIONS"].toUpperCase() === "SAMEORIGIN"
          ) {
            setCanOpen(false);
          } else {
            setCanOpen(true);
          }
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
          setCanOpen(false);
        });
    });
  }, [ActivityId]);

  return (
    <div className="module-content">
      <div className="step-header d-flex items-center justify-content-between">
        <div className="step-header__left">
          <h2 className="step-header__title">{activity?.Title}</h2>
          <span className="step-header__teacher">
            {activity.type} {activity.index}
          </span>
        </div>
        <div className="step-header__right d-flex align-items-center">
          <div className="grade d-flex flex-column mx-3">
            <span className="grade-name">Published</span>
            <span className="grade-value">June 20, 2022</span>
          </div>
          <ActivityNav
            activities={activities}
            activity={activity}
          ></ActivityNav>
        </div>
      </div>
      {!isLoading && (
        <div className="activity-content">
          {canOpen && (
            <div className="material-container">
              <div
                className={clsx("material-item", {
                  fullscreen: isFullscreen,
                })}
              >
                <div className={clsx("article")}>
                  {!isLoading && (
                    <iframe
                      ref={materialRef}
                      frameBorder="no"
                      src={`${materialURL}`}
                      width="100%"
                      height="100%"
                      title={activity?.Title}
                      onLoad={(e) => {
                        console.log(e);
                        try {
                          if (
                            materialRef.current.contentDocument ||
                            materialRef.current.document
                          ) {
                            setCanOpen(true);
                          }
                        } catch (e) {
                          setCanOpen(false);
                        }
                      }}
                      onError={(e) => {
                        setCanOpen(false);
                      }}
                    ></iframe>
                  )}
                </div>
                <div className="toolbar d-flex align-items-center  justify-content-between">
                  <div className="toolbar-left d-flex align-items-center">
                    <button
                      onClick={() => {
                        window.open(materialURL);
                      }}
                    >
                      <LinkIcon></LinkIcon> Open Link in New Tab
                    </button>
                    <button>
                      <ShareIcon></ShareIcon> Share
                    </button>
                  </div>
                  <div className="toolbar-right d-flex align-items-center">
                    <button>
                      <PrintIcon></PrintIcon>
                    </button>
                    <button>
                      <SettingIcon></SettingIcon>
                    </button>
                    <button
                      onClick={() => {
                        setFullscreen(!isFullscreen);
                      }}
                    >
                      <FullscreenIcon />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4 d-flex">
                <LikeButton className="me-4"></LikeButton>
                <LikeButton like={false}></LikeButton>
              </div>
            </div>
          )}
          {!canOpen && (
            <div className="cantopen-container">
              <div className="cantopen-image">
                <ImageCantopen></ImageCantopen>
              </div>
              <div className="cantopen-text">
                For some reason, we couldn't load 😓
              </div>
              <button
                className="button button-primary"
                onClick={() => {
                  window.open(materialURL);
                }}
              >
                See Article
              </button>
            </div>
          )}
        </div>
      )}
      {isLoading && (
        <div className="activity-content">
          <OlsLoader full={false}></OlsLoader>
        </div>
      )}
    </div>
  );
}

export default Material;
