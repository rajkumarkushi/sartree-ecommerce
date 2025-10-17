import Header from '../components/Header';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { FaUtensils, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const Blogs = () => {
  // Rice products data
  const riceProducts = [
    {
      id: 1,
      title: "Sona Masoori Rice",
      description: "Premium quality rice from South India, known for its light texture and pleasant aroma.",
      image: "https://img.freepik.com/premium-photo/rice-burlap-sack_1004890-5846.jpg",
      price: 85,
      originalPrice: 95,
      discount: 10,
      rating: 4.5,
      badges: ["Premium", "Natural", "Aromatic"]
    },
    {
      id: 2,
      title: "1121 Basmati Rice",
      description: "Extra long grain basmati rice with exceptional elongation and aroma.",
      image: "https://img.freepik.com/premium-photo/white-rice-white-surface_45583-1474.jpg",
      price: 120,
      originalPrice: 135,
      discount: 11,
      rating: 4.0,
      badges: ["Extra Long", "Aromatic", "Premium"]
    }
  ];

  // Blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "The Journey of Rice from Field to Plate",
      description: "Explore the fascinating process of rice cultivation and harvesting that brings this staple to your table.",
      image: "https://img.freepik.com/premium-photo/rice-plants-grains-thai-jasmine-rice-wood-bowl-white-surface_436608-1400.jpg"
    },
    {
      id: 2,
      title: "5 Tips for Perfect Rice Every Time",
      description: "Learn essential tips and tricks to cook fluffy and delicious rice effortlessly in your kitchen.",
      image: "https://img.freepik.com/free-psd/close-up-rice-isolated_23-2151656299.jpg"
    }
  ];

  // Featured products data
  const featuredProducts = [
    {
      id: 1,
      title: "Premium Sona Masoori Rice",
      image: "https://img.freepik.com/premium-vector/rice-package-mockup-thailand-food-products-vector-illustration_249011-1303.jpg",
      price: 95,
      originalPrice: 110,
      rating: 4.7
    },
    {
      id: 2,
      title: "Extra Long Basmati Rice",
      image: "https://img.freepik.com/premium-vector/rice-package-mockup-thailand-food-products_249011-1191.jpg",
      price: 130,
      originalPrice: 150,
      rating: 4.3
    }
  ];

  // Video data
  const videos = [
    {
      id: 1,
      title: "Perfect Basmati Rice Recipe",
      description: "Learn how to cook fluffy basmati rice every time",
      url: "https://www.youtube.com/embed/o517kryZ8yk",
      duration: "5:32 min",
      views: "12.5K views"
    },
    {
      id: 2,
      title: "5 Rice Dishes in 10 Minutes",
      description: "Quick and easy rice recipes for busy weeknights",
      url: "https://www.youtube.com/embed/tEDj5MymC5Y",
      duration: "10:15 min",
      views: "8.7K views"
    }
  ];

  // Categories data
  const categories = ["Sona Masoori", "Basmati", "Ponni", "Brown Rice", "Parboiled", "Organic"];

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-warning" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-secondary" />);
    }

    return stars;
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="w-full bg-muted py-10 text-center">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
          BLOG PAGES
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
          </p>
        </div>
        
        <div className="container mx-auto px-4 my-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content (Left Side) */}
            <div className="lg:col-span-8">
              {/* Rice Products Cards */}
              <h2 className="text-2xl font-bold border-b pb-2 mb-6">Our Rice Varieties</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {riceProducts.map(product => (
                  <Card 
                    key={product.id} 
                    className={`h-full ${
                      product.title === "Sona Masoori Rice" || product.title === "1121 Basmati Rice"
                        ? "max-w-sm"
                        : "max-w-md"
                    }`}
                  >
                    <div className="relative h-[200px] w-full overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{product.title}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Our carefully selected rice varieties are sourced from the finest farms, ensuring exceptional quality and taste. Each grain is processed and packaged with utmost care to preserve its natural characteristics and nutritional value.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Read More</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Blog Posts Section */}
              <div className="mt-10 container">
                <h2 className="text-2xl font-bold border-b pb-2 mb-6">Latest Blog Posts</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {blogPosts.map(post => (
                    <Card key={post.id} className="h-full max-w-md">
                      <div className="relative h-[120px] w-full overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-xl">{post.title}</CardTitle>
                        <CardDescription>{post.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="p-4">
                        <Button variant="link" className="px-0">Read More</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4">
              {/* Featured Products Section */}
              <div className="mb-8">
                <h5 className="text-lg font-semibold border-b pb-2 mb-4">Featured Products</h5>
                <div className="space-y-4">
                  {featuredProducts.map(product => (
                    <Card key={product.id} className="p-4">
                      <div className="flex gap-4">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="rounded w-20 h-20 object-cover" 
                        />
                        <div className="flex-1">
                          <h6 className="font-semibold">{product.title}</h6>
                          <div className="mb-2">
                            <span className="font-bold text-green-600">₹{product.price}/kg</span>
                            <span className="text-muted-foreground ml-2 line-through">₹{product.originalPrice}/kg</span>
                          </div>
                          <div className="mb-2 flex items-center">
                            {renderRating(product.rating)}
                            <span className="text-muted-foreground ml-2">({product.rating.toFixed(1)}/5)</span>
                          </div>
                          <Button size="sm" onClick={() => window.location.href = `/products/${product.id}`}>View Details</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Video Slider Section */}
              <div className="mb-8 container">
                <h5 className="text-lg font-semibold border-b pb-2 mb-4">Rice Cooking Videos</h5>
                <div className="space-y-4">
                  {videos.map(video => (
                    <Card key={video.id}>
                      <div className="aspect-video">
                        <iframe 
                          src={video.url} 
                          title={video.title}
                          className="w-full h-full"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-base">{video.title}</CardTitle>
                        <CardDescription>{video.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-between text-sm text-muted-foreground">
                        <span>{video.duration}</span>
                        <span>{video.views}</span>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <Button variant="link" className="mt-2 px-0">Show More Videos</Button>
              </div>

              {/* Related Categories */}
              <div className="mb-8 container">
                <h5 className="text-lg font-semibold border-b pb-2 mb-4">Rice Categories</h5>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <Badge key={index} variant="secondary">{category}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blogs;
