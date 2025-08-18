
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ServiceCategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    slug: string;
  };
}

const ServiceCategoryCard = ({ category }: ServiceCategoryCardProps) => {
  return (
    <Link to={`/services/${category.slug}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="flex flex-col items-center p-6 text-center">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full mb-4",
                category.color
              )}
              dangerouslySetInnerHTML={{ __html: category.icon }}
            />
            <h3 className="font-medium text-lg">{category.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {category.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ServiceCategoryCard;
