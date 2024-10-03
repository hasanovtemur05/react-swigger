const Index = () => {


    const goBack = () => {
        window.history.back(); 
      }


  return (
    <>
      <div class="bg-gray-100 flex items-center justify-center h-screen">
        <div class="text-center">
          <h1 class="text-9xl font-extrabold text-gray-900">404</h1>
          <p class="text-2xl font-semibold text-gray-700 mt-4">
            Oops! Page not found
          </p>
          <p class="text-lg text-gray-500 mt-2">
            Sorry, the page you are looking for doesn't exist.
          </p>
          <button
            onClick={goBack}
            class="mt-6 inline-block px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Go Back
          </button>
        </div>
       
      </div>
    </>
  );
};

export default Index;
