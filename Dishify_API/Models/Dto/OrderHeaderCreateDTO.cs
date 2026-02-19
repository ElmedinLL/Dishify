//OrderHeader is info about the man who place the order

using System.ComponentModel.DataAnnotations;

public class OrderHeaderCreateDTO
{
[Required]
        public string PickUpName { get; set; } = string.Empty;

        [Required]
        public string PickUpPhoneNumber { get; set; }= string.Empty;
         [Required]
         public string PickUpEmail { get; set; }= string.Empty;

        public string ApplicationUserId { get; set; }= string.Empty;

        public DateTime OrderDate { get; set; }
        public double OrderTotal { get; set; }
        public string Status { get; set; } = string.Empty;
        public int TotalItems { get; set; }

        public List<OrderDetailCreateDTO> OrderDetailsDTO { get; set; } = new();
}