using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Dishify_API.Models
{
    // Orderdetail is info about the order itself, like what dish and how many
    // so orderheader is for the person who place the order and
    //  orderdetail is for the order itself
    public class OrderDetail
    {
        [Key]
        public int OrderDetailId { get; set; }
        [Required]
        public int OrderHeaderId { get; set; }
       [Required]
        public int MenuItemId { get; set; }
        [ForeignKey("MenuItemId")]
        public MenuItem? MenuItem { get; set; } 
        [Required]
        public int Quantity { get; set; }
        public string ItemName { get; set; } = string.Empty;
        [Required]
        public double Price { get; set; }
    }
}