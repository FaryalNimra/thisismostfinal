import React from "react";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TeamMembers.scss";

const teamData = [
  {
    id: 1,
    name: "Alina Gul",
    role: "AI&Content Analyst",
    image: "/assets/Member2.png",
    bgColor: "#e0f7fa",
    facebook: "https://www.facebook.com/profile.php?id=61574791244051",
    linkedin: "https://www.linkedin.com/in/alina-gul-8225aa28b",
  },
  {
    id: 2,
    name: "Faryal Nimra",
    role: "Full Stack AI Developer",
    image: "/assets/Member1.png",
    bgColor: "#e0f7fa",
    facebook: "https://www.facebook.com/profile.php?id=61574791244051",
    linkedin: "https://linkedin.com/in/faryal-nimra-4a49a32b6",
  },
  {
    id: 3,
    name: "Maham Nadeem",
    role: "Deep Learning Specialist",
    image: "/assets/Member3.jpg",
    bgColor: "#e0f7fa",
    facebook: "https://www.facebook.com/profile.php?id=61574791244051",
    linkedin: "www.linkedin.com/in/maham-nadeem-070275267",
  },
];

const TeamMembers = () => {
  return (
    <div className="team-container container-fluid">
      <h2 className="team-title text-center">Meet Our Leadership</h2>
      <div className="row justify-content-center">
        {teamData.map((member) => (
          <div
            key={member.id}
            className="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center"
          >
            <div
              className="team-member"
              style={{ backgroundColor: member.bgColor }}
            >
              <div className="team-img-wrapper">
                <img src={member.image} alt={member.name} className="team-img" />
                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <div className="team-socials">
                    <a
                      href={member.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaFacebook />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaLinkedin />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;
