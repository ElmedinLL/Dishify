using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Dishify_API.Data;
using Dishify_API.Models;
using Dishify_API.Utility;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Dishify_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : Controller
    {

        private readonly ApplicationDbContext _db;
        private readonly ApiResponse _apiResponse;
        public OrderController(ApplicationDbContext db, ApiResponse apiResponse)
        {
            _db = db;
            _apiResponse = new ApiResponse();
        }

    [HttpGet]

    public ActionResult<ApiResponse> GetOrders(string userId ="")
    {
      
      IEnumerable<OrderHeader> orderHeadersList = _db.OrderHeaders.Include(u=>u.OrderDetails)
      .ThenInclude(u=>u.MenuItem).OrderByDescending(u=>u.OrderHeaderId);
        if (!string.IsNullOrEmpty(userId))
        {
            orderHeadersList = orderHeadersList.Where(u=>u.ApplicationUserId == userId);
        }

        _apiResponse.Result = orderHeadersList;
        _apiResponse.StatusCode = HttpStatusCode.OK;
        _apiResponse.isSuccess = true;
        return Ok(_apiResponse);
    
    }

    [HttpGet("orderId:int")]
    public ActionResult<ApiResponse> GetOrder(int orderId)
    {
       if (orderId == 0)
       {
        _apiResponse.isSuccess = false;
        _apiResponse.StatusCode = HttpStatusCode.BadRequest;
        _apiResponse.ErrorMessages.Add("Invalid Id");
        return BadRequest(_apiResponse);

       }

        OrderHeader? orderHeader = _db.OrderHeaders.Include(u=>u.OrderDetails).ThenInclude(u=>u.MenuItem)
        .FirstOrDefault(u=>u.OrderHeaderId == orderId);

        if (orderHeader == null)
            {
                _apiResponse.isSuccess = false;
                _apiResponse.StatusCode = HttpStatusCode.NotFound;
                _apiResponse.ErrorMessages.Add("Order Not Found");
                return NotFound(_apiResponse);
            }
            _apiResponse.Result=orderHeader;
            _apiResponse.StatusCode = HttpStatusCode.OK;
            return Ok(_apiResponse);
    }

     [HttpPost]
    public ActionResult<ApiResponse> CreateOrder([FromBody] OrderHeaderCreateDTO orderHeaderDTO)
        {

            try
            {
              if (ModelState.IsValid)
              {
                
                  OrderHeader orderHeader = new OrderHeader()
                {
                    ApplicationUserId = orderHeaderDTO.ApplicationUserId,
                    PickUpEmail = orderHeaderDTO.PickUpEmail,
                    PickUpName = orderHeaderDTO.PickUpName,
                    OrderDate = DateTime.Now,   
                    PickUpPhoneNumber = orderHeaderDTO.PickUpPhoneNumber,
                    OrderTotal = orderHeaderDTO.OrderTotal,
                    Status = SD.status_completed,
                    TotalItems = orderHeaderDTO.TotalItems
                };
                _db.OrderHeaders.Add(orderHeader);
                _db.SaveChanges();
                
                foreach (var orderDetailDTO in orderHeaderDTO.OrderDetailsDTO)
                {
                    OrderDetail orderDetail = new ()
                    {
                        OrderHeaderId = orderHeader.OrderHeaderId,
                        MenuItemId = orderDetailDTO.MenuItemId,
                        Quantity = orderDetailDTO.Quantity,
                        ItemName = orderDetailDTO.ItemName,
                        Price = orderDetailDTO.Price
                    };
                    _db.OrderDetails.Add(orderDetail);  
                }
                _db.SaveChanges();
                _apiResponse.Result = orderHeader;
                orderHeader.OrderDetails = [];
                _apiResponse.StatusCode = HttpStatusCode.Created;
                _apiResponse.isSuccess = true;
                return CreatedAtAction(nameof(GetOrder), new {orderId = orderHeader.OrderHeaderId}, _apiResponse);
               
               
              }
               
                else{
                    _apiResponse.isSuccess = false;
                    _apiResponse.StatusCode = HttpStatusCode.BadRequest;
                    _apiResponse.ErrorMessages = ModelState.Values.SelectMany(u=>u.Errors).Select(u=>u.ErrorMessage).ToList();
                    return BadRequest(_apiResponse);
                }
            } 
            
            
            catch (Exception ex)
            {
                _apiResponse.isSuccess = false;
                _apiResponse.StatusCode = HttpStatusCode.InternalServerError;
                _apiResponse.ErrorMessages.Add(ex.Message);
                return BadRequest(_apiResponse);
            }
            
        }
}
}













