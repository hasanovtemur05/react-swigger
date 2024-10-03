import { useEffect, useState } from "react";
import { Button, Popconfirm, Space, Tooltip, Form, Input } from "antd";
import { category } from "@service";
import { GlobalTable, CategoryModal } from "@components";
import { DeleteOutlined, EditOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
const Index = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [editingCategory, setEditingCategory] = useState(null);
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
      const res = await category.get(params);
      setData(res?.data?.data?.categories);
      setTotal(res?.data?.data?.count);
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    getData();
  }, [params]);

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;
    setParams((prev) => ({
      ...prev,
      page: current,
      limit: pageSize,
    }));
    const current_params = new URLSearchParams(search);
    current_params.set('page', `${current}`);
    current_params.set('limit', `${pageSize}`);
    navigate(`?${current_params}`);
  };

  useEffect(() => {
    const params = new URLSearchParams(search);
    const page = Number(params.get('page')) || 1;
    const limit = Number(params.get('limit')) || 3;
    setParams((prev) => ({
      ...prev,
      page: page,
      limit: limit
    }));
  }, [search]);

  const handleSubmit = async (categoryData) => {
    try {
      if (editingCategory !== null) {
        await category.update(editingCategory.id, categoryData);
        
      } else{
        const resp = await category.create(categoryData);
      if (resp.status === 201) {
        form.resetFields(null);
        getData()
      }}
         
      getData(); 
      handleClose(); 
      form.resetFields();
      setOpen(false)
    } catch (error) {
      console.log("Kategoriya yuborishda xato:", error);
    }
  };

  const editItem = async (item) => {
    setEditingCategory(item);
    setOpen(true);
    form.setFieldsValue(item); 
  };

  const deleteItem = async (id) => {
    try {
      await category.delete(id);
      getData();
    } catch (error) {
      console.log("Error deleting category:", error);
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
      title: "Created At",
      dataIndex: "createdAt", 
      render: (createdAt) => moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              variant="solid"
              color="danger"
              onClick={() => editItem(record)}
              style={{ backgroundColor: "#ffcc55" }}
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
            
            onConfirm={() => deleteItem(record.id)}
          >
            <Tooltip title="Delete">
              <Button
                danger
                variant="solid"
              color="danger"
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
          <Tooltip title="Sub-category">
            <Button
            variant="solid"
              color="danger"
              onClick={() => navigate(`/admin-layout/sub-category/${record.id}`)}
              style={{ backgroundColor: "#52c41a" }}
              icon={<ArrowRightOutlined />}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <CategoryModal
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        editingCategory={editingCategory}
      />
      <div className="flex justify-between items-center my-3">
        <Input
          placeholder="search..."
          className="w-[300px]"
          onChange={handleChange}
        />
        <Button type="primary" onClick={handleCreate}>
          Create Category
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
