import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { ColorRing } from "react-loader-spinner";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import WelcomeVideo from "./components/WelcomeVideo";

function getWeekDates() {
  let start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); 
  start.setHours(0, 0, 0, 0);
  let end = new Date();

  return [start, end];
}




const LandingPage = () => {
  const dispatch = useDispatch();

  const [isDataLoading, setIsDataLoading] = useState(true);
  const { productList, totalPageNum } = useSelector((state) => state.product);
  const [query] = useSearchParams();
  const navigate = useNavigate();
  const name = query.get("name");
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  });
  
  useEffect(() => {
    getDataFromBe();
  }, [])

  const getDataFromBe = async() => {
    setIsDataLoading(true);
    await dispatch(getProductList({...searchQuery, name}));
    setIsDataLoading(false);
  }

  useEffect(()=>{
    dispatch(getProductList({...searchQuery, name}));
  },[query])

  useEffect(() => {
    //검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
    if(searchQuery.name ==="") {
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();
    navigate("?" + query);
  }, [searchQuery]);

  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    setSearchQuery({...searchQuery, page: selected + 1});
  };


  let [start, end] = getWeekDates();
  return (
    <>
      {isDataLoading ?
      <div style={{justifyContent:'center', display:'flex', alignItems:'center'}}>
        <ColorRing
          visible={true}
          height="160"
          width="160"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
    />
    </div>
    :  
    <Container>
      <WelcomeVideo />
       {+searchQuery.page === 1 && 
        (<>
          <br></br>
          <br></br>
          <Row>
            <div>
              <h6>NEW IN</h6>
            </div>
            {productList
              .filter((item) => item.createdAt >= start.toISOString() && item.createdAt < end.toISOString())
              .map((item) => (
                <Col md={3} sm={12} key={item._id}>
                  <ProductCard item={item} />
                </Col>
              ))}
          </Row>
        </>)}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div>
          <h6>ITEMS</h6>
        </div>
      <Row>
        {productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {name === "" ? (
              <h2>등록된 상품이 없습니다!</h2>
            ) : (
              <h2>{name}과 일치한 상품이 없습니다!</h2>
            )}
          </div>
        )}
      </Row>
      <ReactPaginate
          nextLabel="next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={totalPageNum} //total page
          forcePage={searchQuery.page - 1}
          previousLabel="< previous"
          renderOnZeroPageCount={null}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
          className="display-center list-style-none"
        />
    </Container>
    
      }
    </>
   
  );
};

export default LandingPage;
