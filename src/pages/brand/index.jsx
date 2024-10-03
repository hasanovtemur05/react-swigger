import { useEffect, useState} from "react";
import { Button, Popconfirm, Space, Tooltip, Form, Input } from "antd";
import { brand, category } from "@service";
import { BrandModal, GlobalTable } from "@components";
import { DeleteOutlined, EditOutlined} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
const Index = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [editingBrand, setEditingBrand] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const {search} = useLocation
  const [total, setTotal] = useState()
  const [params, setParams] = useState({
    search: "",
    page: 1,
    limit: 3,
  });

  const handleClose = () => {
    setOpen(false);
    setEditingBrand(null);
  };

  const getData = async () => {
    try {
      const res = await brand.get(params); 
      setData(res?.data?.data?.brands);
      setTotal(res?.data?.data?.count);
    } catch (error) {
      console.log("error");
    }
  };

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
    const page = Number(params.get("page")) || 1;
    const limit = Number(params.get("limit")) || 3;
    setParams((prev) => ({
      ...prev,
      page: page,
      limit: limit,
    }));
  }, [search]);
 

  const fetchCategories = async () => {
    try {
      const res = await category.get();
      setCategories(res?.data?.data?.categories);
      console.log(res?.data?.data?.count, 'count');
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getData();
    fetchCategories();
  }, [params]);

  const handleSubmit = async (brandData) => {
    try {
      if (editingBrand !== null) {
        await brand.update(editingBrand.id, brandData);
      } else {
        await brand.create(brandData);
      }
      getData();
      handleClose();
      form.resetFields();
    } catch (error) {
      console.log("Error submitting brand:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await brand.delete(id);
      getData();
    } catch (error) {
      console.log("Error deleting brand:", error);
    }
  };

  const handleCreate = () => {
    setEditingBrand(null);
    setOpen(true);
  };

  const handleChange = (event) => {
    const search_value = event.target.value;
    setParams((prev) => ({
      ...prev,
      search: search_value,
    }));
    const search_params = new URLSearchParams(search);
    search_params.set("search", search_value);
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
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Category ID",
      dataIndex: "category_id",
    },
    {
      title: "File",
      dataIndex: "file",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Tooltip>
            <Button
              onClick={() => {
                setEditingBrand(record);
                setOpen(true)
              }  }
              variant="solid"
              color="danger"
              style={{ marginRight: "8px", backgroundColor: "#ffcc55" }}
              icon={<EditOutlined />}
            />
          </Tooltip>

          <Popconfirm
            title="Delete"
            description="O'chirmoqchimisiz"
            okText="ha"
            cancelText="yoq"
            onConfirm={() => handleDelete(record.id)}
          >
            <Tooltip>
              <Button
                danger
                color="danger"
                variant="solid"
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <BrandModal
        open={open}
        handleClose={handleClose}
        getData={getData}
        handleSubmit={handleSubmit}
        editingBrand={editingBrand}
        categories={categories}
      />
      <div>
        <Input placeholder="search..." className="w-[300px]" onChange={handleChange} />
      <Button
        type="primary"
        onClick={handleCreate}
        style={{ marginBottom: "10px" }}
      >
        Create Brand
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
    </div>
  );
};

export default Index;