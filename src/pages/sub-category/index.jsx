import { useEffect, useState } from "react";
import { Button, Popconfirm, Space, Tooltip, Form, Input, message } from "antd";
import subcategory from "../../service/sub-category";
import { GlobalTable, SubCategoryModal } from "@components";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Index = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [editingCategory, setEditingCategory] = useState(null);
  const { id } = useParams();
  const [params, setParams] = useState({
    search: "",
    page: 1,
    limit: 3,
  });

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
  };

  const getData = async () => {
    try {
      const res = await subcategory.get(id, { params });
      if (res.status === 200) {
        setData(res.data.data.subcategories);
        setTotal(res.data.data.count);
      } else {
        message.error(`Server xatosi: ${res.status}`);
      }
    } catch (error) {
      message.error("Ma'lumotni olishda xato.");
    }
  };

  useEffect(() => {
    getData();
  }, [id, search, params]);

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    setParams((prev) => ({
      ...prev,
      page: current,
      limit: pageSize,
    }));
    const current_params = new URLSearchParams(search);
    current_params.set("page", `${current}`);
    current_params.set("limit", `${pageSize}`);
    navigate(`?${current_params.toString()}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(search);
    const page = Number(params.get("page")) || 1;
    const limit = Number(params.get("limit")) || 3;
    setParams((prev) => ({
      ...prev,
      page: page,
      limit: limit,
    }));
  }, [search]);

  const handleSubmit = async (subcategoryData) => {
    const newData = {
      name: subcategoryData.name,
      parent_category_id: +id,
    };
    try {
      if (editingCategory) {
        await subcategory.update(editingCategory.id, newData);
        message.success("Kategoriya muvaffaqiyatli yangilandi!");
      } else {
        const resp = await subcategory.create(newData);
        if (resp?.status === 201) {
          getData();
          message.success("Kategoriya muvaffaqiyatli saqlandi!");
        }
      }
      handleClose();
      form.resetFields();
    } catch (error) {
      console.error("Error submitting:", error);
      message.error("Kategoriya saqlashda xato.");
    }
    getData();
  };

  const editItem = (item) => {
    setEditingCategory(item);
    setOpen(true);
    form.setFieldsValue(item);
  };

  const deleteItem = async (id) => {
    try {
      await subcategory.delete(id);
      message.success("Kategoriya muvaffaqiyatli o'chirildi!");
      getData();
    } catch (error) {
      console.log("Error deleting category:", error);
      message.error("Kategoriya o'chirishda xato.");
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setOpen(true);
    form.resetFields();
  };

  const handleChange = (event) => {
    setParams((prev) => ({
      ...prev,
      search: event.target.value,
    }));
    const search_params = new URLSearchParams(search);
    search_params.set("search", event.target.value);
    search_params.set("page", "1");
    navigate(`?${search_params.toString()}`);
  };

  const columns = [
    {
      title: "T/R",
      render: (_, __, index) => (params.page - 1) * params.limit + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button onClick={() => editItem(record)} icon={<EditOutlined />} />
          </Tooltip>
          <Popconfirm
            title="Ushbu kategoriya o'chirilishini tasdiqlaysizmi?"
            onConfirm={() => deleteItem(record.id)}
          >
            <Tooltip title="Delete">
              <Button icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <SubCategoryModal
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        editingCategory={editingCategory}
        form={form}
      />
      <div className="flex justify-between items-center my-3">
        <Input
          placeholder="search..."
          className="w-[300px]"
          onChange={handleChange}
        />
        <Button type="primary" onClick={handleCreate}>
          Kategoriya qo'shish
        </Button>
      </div>
      <GlobalTable
        columns={columns}
        data={data}
        pagination={{
          current: params.page,
          pageSize: params.limit,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ["2", "5", "7", "10", "12"],
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default Index;
