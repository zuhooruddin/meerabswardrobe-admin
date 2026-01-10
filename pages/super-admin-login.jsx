import { FlexRowCenter } from "components/flex-box";
import SEO from "components/SEO";
import Login from "pages-sections/sessions/SuperAdminLogin";

const LoginPage = () => {
  return (
    <FlexRowCenter flexDirection="column" minHeight="100vh">
      <SEO title="Super Admin Login" />
      <Login />
    </FlexRowCenter>
  );
};

export default LoginPage;
