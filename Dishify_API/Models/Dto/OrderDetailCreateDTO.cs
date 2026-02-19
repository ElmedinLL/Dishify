using System.ComponentModel.DataAnnotations;

public class OrderDetailCreateDTO
{
       [Required]   
        public int MenuItemId { get; set; }
     
        [Required]
        public int Quantity { get; set; }
        public string ItemName { get; set; } = string.Empty;
        [Required]
        public double Price { get; set; }
    }