import UserService from "../services/UserService";
import Layout from "../components/Layout/Layout";
import PartnerForm from "../components/PartnerForm/PartnerForm";

const userService = new UserService();

export default function Perfil() {
  const user = userService.getUser();

  return (
    <Layout titulo="Perfil">
      <PartnerForm
        disabledDocument={true}
        disabledConsultores={true}
        parceiroParam={user}
        editando={true}
      />
    </Layout>
  )
}