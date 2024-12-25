import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import { BlogContext } from "./ContextProvider.jsx";
import { useContext, useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

function Analytics() {
  const { BACKEND_API } = useContext(BlogContext);
  const [authorName, setAuthorName] = useState("");
  const [totalBlogViews, setTotalBlogViews] = useState("");
  const [totalBlogLikes, setTotalBlogLikes] = useState("");
  const [totalBlogShares, setTotalBlogShares] = useState("");
  const [listOfAllBlogs, setListOfAllBlogs] = useState([]);
  const [selectedBlogTitle, setSelectedBlogTitle] = useState("");
  const [sumOfComments, setSumOfComments] = useState("");
  const [displayBlogAnalytics, setDisplayBlogAnalytics] = useState(false);

  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        color: "white",
      },
      title: {
        display: true,
        color: "white",
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
          color: "white",
        },
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
    },
  };
  useEffect(() => {
    fetchAllBlogsByAuthorName();
  }, []);

  const fetchAllBlogsByAuthorName = async () => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(
        `${BACKEND_API}/api/blogviews/fetchblogsbyauthorname`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await data.json();
      if (response.success === true) {
        const viewsData = response.post;
        setListOfAllBlogs(response.post);
        const groupedData = viewsData.reduce((acc, view) => {
          setAuthorName(view.author);
          const date = new Date(view.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const labels = Object.keys(groupedData);
        const data = Object.values(groupedData);

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Views per day ",
              data,
              backgroundColor: "#0D6EFD",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } else if (response.success === false) {
        setListOfAllBlogs([]);
      }
    } catch (error) {
      console.log("Error while fetching blogs by author name", error);
    }
  };

  const fetchOneBlogForAnalysis = async (blogID) => {
    const token = localStorage.getItem("token");
    try {
      const data = await fetch(
        `${BACKEND_API}/api/blogviews/fetchoneblogforanalytics/${blogID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const response = await data.json();
      if (response.success === true) {
        fetchAllComments(blogID);
        const viewsData = response.blog_views;
        setDisplayBlogAnalytics(true);

        const groupedData = viewsData.reduce((acc, view) => {
          setSelectedBlogTitle(`${view.blogTitle}`);

          const date = new Date(view.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});

        const labels = Object.keys(groupedData);
        const data = Object.values(groupedData);

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Views per day ",
              data,
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      }
    } catch (error) {
      console.log("Error while fetching blog views count", error);
    }
  };

  const fetchAllComments = async (blogID) => {
    try {
      const data = await fetch(
        `${BACKEND_API}/api/comment/fetchallcomments/${blogID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const response = await data.json();

      if (response.success) {
        setSumOfComments(response.sumOfComments);
      }
    } catch (error) {
      console.log("Error while fetching comments", error);
    }
  };

  return (
    <>
      <div
        style={{
          marginTop: "70px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Dropdown
          style={{
            margin: "0px auto 30px auto",
            width: "90vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Dropdown.Toggle
            style={{
              backgroundColor: "#151533",
              border: "1px solid rgb(255,255,255,0.2)",
              borderRadius: "4px",
              padding: "10px 30px",
              margin: "auto",
              width: "100%",
              maxWidth: "500px",
              textWrap: "wrap",
            }}
            id="dropdown-basic"
          >
            Select one of published blogs to view analytics
          </Dropdown.Toggle>

          <Dropdown.Menu
            style={{
              width: "100%",
              maxWidth: "500px",
              textAlign: "center",
              textWrap: "wrap",
              color: "black",
            }}
          >
            {listOfAllBlogs &&
              listOfAllBlogs.map(
                (blog) =>
                  blog && (
                    <Dropdown.Item
                      key={blog.id}
                      onClick={() => {
                        fetchOneBlogForAnalysis(blog.id);
                        setTotalBlogLikes(blog.likes);
                        setTotalBlogShares(blog.shares);
                        setTotalBlogViews(blog.views);
                      }}
                    >
                      {blog.title}
                    </Dropdown.Item>
                  )
              )}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "90%",
          margin: "20px auto",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {displayBlogAnalytics === true &&
        authorName &&
        totalBlogLikes &&
        totalBlogShares &&
        totalBlogViews ? (
          <p
            style={{
              padding: "5px 10px",
              textWrap: "nowrap",
              borderRadius: "6px",
              backgroundColor: "#151533",
              color: "white",
              height: "45px",
            }}
          >
            {selectedBlogTitle}
          </p>
        ) : (
          <p>{selectedBlogTitle}</p>
        )}
        {displayBlogAnalytics === true && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              margin: "5px auto",
              width: "100%",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                border: "1px solid rgb(255,255,255,0.2)",
                padding: "5px 10px",
                textWrap: "nowrap",
                borderRadius: "6px",
                backgroundColor: "#151533",
                color: "white",
                height: "45px",
              }}
            >
              {totalBlogViews} Views
            </button>
            <button
              style={{
                border: "1px solid rgb(255,255,255,0.2)",
                padding: "5px 10px",
                textWrap: "nowrap",
                borderRadius: "6px",
                backgroundColor: "#151533",
                color: "white",

                height: "45px",
              }}
            >
              {totalBlogLikes} Likes
            </button>
            <button
              style={{
                border: "1px solid rgb(255,255,255,0.2)",
                padding: "5px 10px",
                textWrap: "nowrap",
                borderRadius: "6px",
                backgroundColor: "#151533",
                color: "white",
                height: "45px",
              }}
            >
              {totalBlogShares} Share
            </button>
            <button
              style={{
                border: "1px solid rgb(255,255,255,0.2)",
                padding: "5px 10px",
                textWrap: "nowrap",
                borderRadius: "6px",
                backgroundColor: "#151533",
                color: "white",
                height: "45px",
              }}
            >
              {sumOfComments} Comments
            </button>
          </div>
        )}

        {chartData.labels.length > 0 ? (
          <div
            className="analytics-container"
            style={{
              width: "100%",
              height: "400px",
              maxHeight: "60vh",
              minHeight: "300px",
            }}
          >
            <Bar
              data={chartData}
              options={options}
              style={{
                maxWidth: "100%",
                height: "100%",
              }}
            />
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </>
  );
}

export default Analytics;
