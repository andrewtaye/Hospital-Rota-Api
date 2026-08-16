import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import shiftedLogo from "../assets/shifted-logo.jpg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [introFinished, setIntroFinished] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  const timer = setTimeout(() => {
    setIntroFinished(true);
  }, 3200);

  return () => clearTimeout(timer);
}, []);


  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("token/", {
        username,
        password,
      });

      localStorage.setItem(
        "accessToken",
        response.data.access
      );

      localStorage.setItem(
        "refreshToken",
        response.data.refresh
      );

      navigate("/dashboard");
    } catch (requestError) {
      console.error(requestError);

      setError("Incorrect username or password.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main
      className={
        introFinished
          ? "shifted-login shifted-login--ready"
          : "shifted-login"
      }
    >
      <div className="shifted-login__background">
        <div className="shifted-login__blue-light" />
        <div className="shifted-login__green-light" />
        <div className="shifted-login__grid" />
      </div>

      <section className="shifted-login__intro">
        <div className="shifted-login__logo-glow" />

        <img
          className="shifted-login__logo"
          src={shiftedLogo}
          alt="Shifted - St Magnus Community"
        />
      </section>

      <section className="shifted-login__content">
        <div className="shifted-login__form-container">
          <div className="shifted-login__heading">
            <p>Welcome back</p>

            <h1>Sign in</h1>

            <span>
              Access your rota and manage your schedule.
            </span>
          </div>

          <form
            className="shifted-login__form"
            onSubmit={handleSubmit}
          >
            <div className="shifted-login__field">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>

            <div className="shifted-login__field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <div className="shifted-login__error">
                {error}
              </div>
            )}

            <button
              className="shifted-login__button"
              type="submit"
              disabled={isLoading}
            >
              {isLoading
                ? "Signing in..."
                : "Enter Shifted"}
            </button>
          </form>

          <p className="shifted-login__footer">
            ST MAGNUS COMMUNITY
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;