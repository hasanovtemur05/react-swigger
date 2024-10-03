import { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { Option } = Select;

const brandCategoryValidationSchema = Yup.object().shape({
  name: Yup.string().required("Brand Category Name is required"),
  brand_id: Yup.number().required("Brand ID is required").typeError("Brand ID must be a number"),
});

const BrandCategoryModal = ({ open, handleClose, editingBrandCategory, brands, handleSubmit }) => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    brand_id: "",
  });

  useEffect(() => {
    if (open && editingBrandCategory) {
      setInitialValues({
        name: editingBrandCategory.name || "",
        brand_id: editingBrandCategory.id || "",
      });
    } else {
      setInitialValues({ name: "", brand_id: "" });
    }
  }, [open, editingBrandCategory]);

  const onSubmit = async (values) => {
    try {
      await handleSubmit(values);
      message.success("Brand Category saved successfully!");
      handleClose();
    } catch (error) {
      console.error("Error submitting Brand Category:", error);
      message.error("Error submitting Brand Category");
    }
  };

  return (
    <Modal
      title={editingBrandCategory?.id ? "Edit Brand Category" : "Add Brand Category"}
      open={open}
      onCancel={handleClose}
      footer={null}
    >
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={brandCategoryValidationSchema}
        onSubmit={onSubmit}
      >
        {({ values, isSubmitting, setFieldValue, handleChange, handleSubmit }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Brand Category Name">
              <Input
                name="name"
                value={values.name}
                onChange={handleChange}
              />
              <ErrorMessage name="name" component="div" style={{ color: 'red' }} />
            </Form.Item>

            <Form.Item label="Brand">
              <Select
                name="brand_id"
                value={values.id}
                onChange={(value) => setFieldValue("brand_id", value)}
                placeholder="Select Brand"
              >
                {brands.map((brand) => (
                  <Option key={brand.id} value={brand.id}>
                    {brand.name}
                  </Option>
                ))}
              </Select>
              <ErrorMessage name="id" component="div" style={{ color: 'red' }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                {editingBrandCategory?.id ? "Update" : "Create"}
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default BrandCategoryModal;
