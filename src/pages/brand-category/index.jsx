import { BrandCategoryModal, GlobalTable } from "@components";
import { Button, Space, Tooltip, Popconfirm, Form, Input } from "antd";
import { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { brandCategory, brand } from '@service';
import { useLocation, useNavigate } from "react-router-dom";

const Index = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [brands, setBrands] = useState([]); 
  const navigate = useNavigate()
  const {search} = useLocation()
  const [total, setTotal] = useState()
  const [editingBrandCategory, setEditingBrandCategory] = useState(null);
  const [params, setParams] = useState({
    search: "",
    page: 1,
    limit: 3,
  });

  const getData = async () => {
    try {
      const res = await brandCategory.get(params);
      if (res.status === 200) {
        setData(res?.data?.data?.brandCategories) 
        setTotal(res?.data?.data?.count);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const fetchBrands = async () => {
    try {
        const res = await brand.get();
        setBrands(res?.data?.data?.brands);
        console.log(res?.data?.data?.count, 'count');
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
      getData()
  };

  const handleCreate = async () => {
    setOpen(true);
    getData()
  };

  const handleSubmit = async (dataToSend) => {
    try {
      
      if (editingBrandCategory !== null) {
        await brandCategory.update(editingBrandCategory.id, dataToSend);
      } else {
        await brandCategory.create(dataToSend);
      }
      getData(); 
      handleClose();
    } catch (error) {
      console.log("Error submitting brand:", error);
    }
    getData()
  };
  

  const handleClose = () => {
    setOpen(false);
    setEditingBrandCategory(null);
  };

  const editItem = (record) => {
    setEditingBrandCategory(record);
    setOpen(true); 
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
        title: "brand_id",
        dataIndex: "brand_id",
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
            title="Ushbu kategoriya o'chirilishini tasdiqlaysizmi?"
            onConfirm={() => deleteItem(record.id)}
          >
            <Tooltip title="Delete">
              <Button
                danger
                icon={<DeleteOutlined />}
                variant="solid"
                color="danger"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <BrandCategoryModal
        open={open}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
        editingBrandCategory={editingBrandCategory}
        brands={brands}
      />
      <Input placeholder="search..." className="w-[300px]" onChange={handleChange}/>
      <Button
        type="primary"
        onClick={handleCreate}
        style={{ marginBottom: "10px" }}
      >
        Create Brand Category
      </Button>

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
