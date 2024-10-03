import { Modal, Input, Button, Form, message } from "antd";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";

const categoryValidationSchema = Yup.object().shape({
  name: Yup.string().required("Kategoriya nomi kerak"),
});

export default function SubCategoryModal({
  open,
  handleClose,
  handleSubmit,
  editingCategory,
}) {
  const initialValues = {
    name: editingCategory?.name || "", 
    parent_category_id: editingCategory?.parent_category_id || "",
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      await handleSubmit(values);
      message.success("Kategoriya muvaffaqiyatli saqlandi!");
    } catch (error) {
      console.log("Yuborishda xato:", error);
      message.error("Kategoriya saqlashda xato");
    } finally {
      setSubmitting(false);
      handleClose();
    }
  };

  return (
    <Modal
      title={editingCategory?.id ? "Kategoriya tahrirlash" : "Kategoriya qo'shish"}
      open={open}
      onCancel={handleClose}
      footer={null}
    >
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
  {({ values, handleChange, handleSubmit, isSubmitting }) => (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Kategoriya nomi">
        <Input name="name" value={values.name} onChange={handleChange} />
        <ErrorMessage name="name" component="div" style={{ color: "red" }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isSubmitting} block>
          {editingCategory ? "Yangilash" : "Saqlash"}
        </Button>
      </Form.Item>
    </Form>
  )}
</Formik>

    </Modal>
  );
}